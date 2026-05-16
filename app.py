from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from models import db, Task
import os

app = Flask(__name__)

# Database configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'tasks.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
CORS(app)

# Create database tables
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    search = request.args.get('search', '')
    filter_status = request.args.get('status', 'all')
    
    query = Task.query
    
    if search:
        query = query.filter(Task.content.ilike(f'%{search}%'))
        
    if filter_status == 'completed':
        query = query.filter(Task.completed == True)
    elif filter_status == 'pending':
        query = query.filter(Task.completed == False)
        
    tasks = query.order_by(Task.created_at.desc()).all()
    return jsonify([task.to_dict() for task in tasks])

@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.get_json()
    if not data or 'content' not in data:
        return jsonify({'error': 'Content is required'}), 400
    
    new_task = Task(content=data['content'], category=data.get('category', 'General'))
    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.to_dict()), 201

@app.route('/api/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    task = Task.query.get_or_404(id)
    data = request.get_json()
    
    if 'completed' in data:
        task.completed = data['completed']
    if 'content' in data:
        task.content = data['content']
        
    db.session.commit()
    return jsonify(task.to_dict())

@app.route('/api/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Task.query.get_or_404(id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted successfully'})

@app.route('/api/stats', methods=['GET'])
def get_stats():
    total = Task.query.count()
    completed = Task.query.filter_by(completed=True).count()
    pending = total - completed
    return jsonify({
        'total': total,
        'completed': completed,
        'pending': pending
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
